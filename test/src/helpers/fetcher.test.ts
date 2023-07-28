import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { fetcher } from "../../../src/helpers/fetcher";
import { diContainer } from "../../../src/helpers/injector";

describe("fetcher", () => {
	let mockedTimestamp;

	beforeAll(() => {
		mockedTimestamp = 1673673600000;
		vi.spyOn(Date, "now").mockImplementation(() => mockedTimestamp);
		diContainer._cookieHandler.setCookie = vi.fn();
		diContainer._cookieHandler.getCookie = vi.fn();
		diContainer.hasBeenConfigured = true;
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	test("fetcher should set sessionLifetime when rememberMe is set to true with given param[sessionLifetime]", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() => true);

		const sessionLifetime = 890000000;

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			sessionLifetime
		);
		expect(diContainer._cookieHandler.setCookie).toHaveBeenCalled();
		const newSessionLife = new Date(Date.now() + sessionLifetime);
		expect(diContainer._cookieHandler.setCookie).toHaveBeenCalledWith(
			"frontastic-session",
			"SESSION",
			{
				expires: newSessionLife,
			}
		);
	});

	test("fetcher should not set sessionLifetime when rememberMe is set to false", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() => false);

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			890000000
		);
		expect(diContainer._cookieHandler.setCookie).toHaveBeenCalled();

		expect(diContainer._cookieHandler.setCookie).toHaveBeenCalledWith(
			"frontastic-session",
			"SESSION",
			{
				expires: undefined,
			}
		);
	});
});
