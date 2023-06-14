import { fetch, Headers } from "cross-fetch";
import { beforeAll, vi } from "vitest";

global.fetch = fetch;
beforeAll(() => {
	vi.mock("cross-fetch", async () => {
		const actual = (await vi.importActual(
			"cross-fetch"
		)) as unknown as Object;

		return {
			...actual,
			fetch: vi.fn((url) => {
				const headers = new Headers();
				headers.append("Content-Type", "application/json");
				headers.append("Frontastic-Session", "SESSION");
				return {
					ok: true,
					status: 200,
					statusText: "OK",
					headers,
					body: {
						id: 1,
						title: "Item title",
						description: "Item description",
						price: 100.0,
					},
					json(): Promise<any> {
						return new Promise((resolve, reject) => {
							resolve({ ...this.body, ...this.headers });
						});
					},
				};
			}),
		};
	});
});
