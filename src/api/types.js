// @flow

export type Kitty = {
	source_url: string,
	id: string,
	url: string
};

export type PromiseCancel<T> = {
	cancel: (reason?: string) => void,
	promise: Promise<T>
};
export type ApiMethod<Args, R> = (args: Args) => PromiseCancel<R>;

export interface Api {
	+fetchRandomKitty_: ApiMethod<FetchKittyParams, Kitty>;
	+fetchKitty_: ApiMethod<string, Kitty>;
	+fetchKitties_: ApiMethod<FetchKittiesParams, Array<Kitty>>;
	+voteKitty_: ApiMethod<VoteKitty, {}>;
	+getVotes_: ApiMethod<void, Array<Kitty>>;
}

export type VoteKitty = {
	kittyId: number,
	score: number
};

export type FetchKittyParams = {
	type: "gif" | "img"
};

export type FetchKittiesParams = FetchKittyParams & {
	count: number
};
