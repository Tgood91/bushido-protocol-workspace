import assert from "node:assert/strict";
import { test } from "node:test";
import { TOKEN_LIST } from "../data/tokens";
import { calculateRouteQuote, getAvailableRouters } from "./routerEngine";

const token = (symbol: string, chainId: number) => {
  const foundToken = TOKEN_LIST.find((item) => item.symbol === symbol && item.chainId === chainId);
  assert.ok(foundToken, `Expected ${symbol} on chain ${chainId}`);
  return foundToken;
};

test("minimum received applies the selected slippage tolerance to quoted output", () => {
  const fromToken = token("ETH", 8453);
  const toToken = token("USDC", 8453);
  const quote = calculateRouteQuote(fromToken, toToken, 1, "auto", false, [], 1);

  assert.ok(quote);
  assert.equal(quote.minimumReceivedAmount, quote.toAmount * 0.99);
  assert.equal(quote.slippageTolerancePercent, 1);
});

test("available routers match the type of route and supported chains", () => {
  assert.deepEqual(getAvailableRouters(token("ETH", 8453), token("USDC", 8453)), ["1inch_v5", "aerodrome"]);
  assert.deepEqual(getAvailableRouters(token("ETH", 8453), token("USDC", 10)), ["lifi", "relay"]);
  const polygonToken = { ...token("ETH", 1), chainId: 137 as const };
  assert.deepEqual(getAvailableRouters(polygonToken, token("ETH", 8453)), ["lifi"]);
});

test("quotes honor compatible router preferences and safely fall back for incompatible ones", () => {
  const baseEth = token("ETH", 8453);
  const baseUsdc = token("USDC", 8453);
  const baseQuote = calculateRouteQuote(baseEth, baseUsdc, 1, "1inch_v5");
  const aerodromeQuote = calculateRouteQuote(baseEth, baseUsdc, 1, "aerodrome");
  const crossChainQuote = calculateRouteQuote(baseEth, token("USDC", 10), 1, "aerodrome");

  assert.equal(baseQuote?.primaryRouter, "1inch_v5");
  assert.equal(baseQuote?.hops[0]?.protocol, "1inch Pathfinder");
  assert.equal(aerodromeQuote?.hops[0]?.protocol, "Aerodrome");
  assert.equal(crossChainQuote?.primaryRouter, "relay");
});

test("quotes use the correct chain name in route hops", () => {
  const polygonToken = { ...token("ETH", 1), chainId: 137 as const };
  const quote = calculateRouteQuote(polygonToken, polygonToken, 1);

  assert.equal(quote?.hops[0]?.chain, "Polygon");
});

test("invalid amounts and invalid token prices do not produce quotes", () => {
  const fromToken = token("ETH", 8453);
  const toToken = token("USDC", 8453);

  assert.equal(calculateRouteQuote(fromToken, toToken, Number.NaN), null);
  assert.equal(calculateRouteQuote({ ...fromToken, priceUsd: 0 }, toToken, 1), null);
});
