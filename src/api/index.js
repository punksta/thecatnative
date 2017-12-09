// @flow
import {xmlToJson} from "../xml";
import axios from 'axios'
import config from "../config.json"
import type {Api, FetchKittiesParams, FetchKittyParams, Kitty} from "./types";

const url = "http://thecatapi.com";




class ApiIml implements Api {
	fetchKitty = () => {
		return axios.get(`${url}/api/images/get`, {
			params: {
				format: 'xml',
				type: 'gif',
				api_key: config.api_key,
				size: 'med'
			}
		})
			.then(r => r.data)
			.then(xmlToJson)
			.then(r => r.response.data.images.image)
	}

	fetchKitties = () => {
		return axios.get(`${url}/api/images/get`, {
			params: {
				format: 'xml',
				api_key: config.api_key,
				size: 'med',
				results_per_page: 30
			}
		})
			.then(r => r.data)
			.then(xmlToJson)
			.then(r => {
				return r.response.data.images.image;
			})
	}

	fetchKitty_ = (params) => {
		const r =  this.fetchKitties_({...params, count:1});

		return {
			cancel: r.cancel,
			promise: r.promise.then(array => array[0])
		}
	}

	fetchKitties_= (params) => {
		const r = requestGet({
			url: `${url}/api/images/get`,
			params: {
				format: 'xml',
				type: params.type === "gif" ? 'gif' : 'png,jpg',
				size: 'med',
				results_per_page: params.count
			}
		});

		return {
			cancel: r.cancel,
			promise: r.promise
				.then(r => xmlToJson(r.data))
				.then(r => {
					return r.response.data.images.image;
				})
		}
	}
}

type Response = {data: string}

type CancelPromise = {
	cancel: (reason?: string) => void,
	promise: Promise<Response>
}

const requestGet = <T>(data: { url: string, params: {} }): CancelPromise => {
	const cancelSource = axios.CancelToken.source();

	const request = {
		method: 'get',
		url: data.url,
		params: {
			...data.params,
			api_key: config.api_key
		},
		cancelToken: cancelSource.token
	};

	const promise:  Promise<{data: string}> = axios(request);

	return {
		promise,
		cancel: cancelSource.cancel
	};
}

const api: Api = new ApiIml();

export default api;