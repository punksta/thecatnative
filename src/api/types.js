// @flow

export type Kitty = {
	source_url: string,
	id: string,
	url: string
};

export type Category = {
	id: number,
	name: string
};

export type PromiseCancel<T> = {
	cancel: (reason?: string) => void,
	promise: Promise<T>
};
export type ApiMethod<Args, R> = (args: Args) => PromiseCancel<R>;

export interface Api {
	+fetchRandomKitty: ApiMethod<FetchKittyParams, Kitty>;
	+fetchKitty: ApiMethod<string, Kitty>;
	+fetchKitties: ApiMethod<FetchKittiesParams, Array<Kitty>>;
	+voteKitty: ApiMethod<VoteKitty, {}>;
	+getVotes: ApiMethod<void, Array<Kitty>>;
	+getCategories: ApiMethod<void, Array<Category>>;
}

export type VoteKitty = {
	kittyId: number,
	score: number
};

export type FetchKittyParams = {
	type: "gif" | "img"
};

export type FetchKittiesParams = FetchKittyParams & {
	count: number,
	categories?: Array<number>
};
