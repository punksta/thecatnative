// @flow
import {Observable} from "rxjs/Observable";
import type {PromiseCancel} from "../api/types";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/catch";

export const asObservable = <T>(promise: PromiseCancel<T>): Observable<T> => {
	return Observable.create(observer => {
		promise.promise
			.then(result => {
				observer.next(result);
			})
			.catch(error => {
				observer.error(error);
			});
		return () => {
			promise.cancel("observable unsubsidised");
		};
	});
};

export const fromPromiseIgnoreErrors = <T>(
	promise: Promise<T>
): Observable<T> => {
	return Observable.of(promise).mergeMap(p =>
		Observable.fromPromise(p).catch(e => Observable.empty())
	);
};
