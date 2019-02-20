// @flow
import axios from "axios";
import config from "../config.json";
import type {
	Api,
	ApiMethod,
	Category,
	FetchKittiesParams,
	FetchKittyParams,
	Kitty
} from "./types";

const url = "https://api.thecatapi.com";

class ApiIml implements Api {
	+fetchRandomKitty = params => {
		const r = this.fetchKitties({...params, count: 1});
		return {
			cancel: r.cancel,
			promise: r.promise.then(response =>
				Array.isArray(response) ? response[0] : response
			)
		};
	};

	+fetchKitty = kittyId => {
		const r = requestGet({
			url: `${url}/v1/images/${kittyId}`
		});

		return {
			cancel: r.cancel,
			promise: r.promise.then(r => r.response.data)
		};
	};

	fetchKitties = params => {
		const r = requestGet({
			url: `${url}/v1/images/search`,
			params: {
				mime_types: params.type === "gif" ? "gif" : "png,jpg",
				limit: params.count,
				category_ids:
					"category_ids" in params ? params.category_ids[0] : undefined
			}
		});

		return {
			cancel: r.cancel,
			promise: r.promise.then(r => r.data)
		};
	};

	voteKitty = params => {
		const r = requestGet({
			url: `${url}/api/images/vote`,
			params: {
				image_id: params.kittyId,
				score: params.score
			}
		});

		return {
			cancel: r.cancel,
			promise: r.promise.then(r => r.data)
		};
	};

	getVotes = () => {
		const r = requestGet({
			url: `${url}/api/images/getvotes`,
			params: {
				api_key: config.api_key
			}
		});

		return {
			cancel: r.cancel,
			promise: r.promise.then(r => r.data)
		};
	};

	+getCategories = () => {
		const r = requestGet({
			url: `${url}/v1/categories`,
			params: {}
		});

		return {
			cancel: r.cancel,
			promise: r.promise.then(r => r.data)
		};
	};
}

type Response = {data: string};

type CancelPromise = {
	cancel: (reason?: string) => void,
	promise: Promise<Response>
};

axios.interceptors.request.use(data => {
	console.log(JSON.stringify(data));
	return data;
});

const requestGet = <T>(data: {url: string, params: {}}): CancelPromise => {
	const cancelSource = axios.CancelToken.source();

	const request = {
		method: "get",
		url: data.url,
		params: data.params,
		headers: {
			"x-api-key": config.api_key
		},
		cancelToken: cancelSource.token
	};

	const promise: Promise<{data: string}> = axios(request);

	return {
		promise,
		cancel: cancelSource.cancel
	};
};

const api: Api = new ApiIml();

export default api;
