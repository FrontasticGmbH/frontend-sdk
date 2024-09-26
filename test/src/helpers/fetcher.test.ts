import { afterAll, beforeAll, describe, expect, test, vi } from "vitest";
import { fetcher } from "../../../src/helpers/fetcher";
import { dependencyContainer } from "../../../src/library/DependencyContainer";
import { SDK } from "../../../src/library/SDK";

describe("fetcher", () => {
	let mockedTimestamp;

	beforeAll(() => {
		mockedTimestamp = 1673673600000;
		vi.spyOn(Date, "now").mockImplementation(() => mockedTimestamp);
		const sdk = new SDK();
		sdk.configure({
			endpoint: "",
			currency: "EUR",
			locale: "de_DE",
			extensionVersion: "",
		});

		dependencyContainer().configure({
			// @ts-expect-error
			cookieHandler: {},
			// @ts-expect-error
			redactHandler: {},
		});

		dependencyContainer().cookieHandler().setCookie = vi.fn();
		dependencyContainer().cookieHandler().getCookie = vi.fn();
	});

	afterAll(() => {
		vi.resetAllMocks();
	});

	test("should set sessionLifetime when rememberMe is set to true with given param[sessionLifetime]", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() =>
			Promise.resolve(true)
		);

		const sessionLifetime = 890000000;

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			sessionLifetime
		);
		expect(
			dependencyContainer().cookieHandler().setCookie
		).toHaveBeenCalled();
		const newSessionLife = new Date(Date.now() + sessionLifetime);
		expect(
			dependencyContainer().cookieHandler().setCookie
		).toHaveBeenCalledWith("frontastic-session", "SESSION", {
			expires: newSessionLife,
		});
	});

	test("should not set sessionLifetime when rememberMe is set to false", async () => {
		const cookieManagement = await import(
			"../../../src/helpers/cookieManagement"
		);

		cookieManagement.rememberMeCookie.get = vi.fn(() =>
			Promise.resolve(false)
		);

		await fetcher(
			"https://test-xyz.frontastic.dev",
			{
				method: "GET",
			},
			{},
			890000000
		);
		expect(
			dependencyContainer().cookieHandler().setCookie
		).toHaveBeenCalled();

		expect(
			dependencyContainer().cookieHandler().setCookie
		).toHaveBeenCalledWith("frontastic-session", "SESSION", {
			expires: undefined,
		});
	});
});
