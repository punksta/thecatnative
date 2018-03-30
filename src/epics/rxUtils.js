// @flow
import {Observable} from "rxjs/Observable";
import type {PromiseCancel} from "../api/types";
import "rxjs/add/observable/fromPromise";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/mergeMap";
import "rxjs/add/observable/empty";
import "rxjs/add/observable/of";

export const asObservable = <T>(promise: PromiseCancel<T>): Observable<T> =>
	Observable.create(observer => {
		promise.promise
			.then(result => {
				observer.next(result);
				observer.complete();
			})
			.catch(error => {
				observer.error(error);
			});
		return () => {
			promise.cancel("observable unsubscribed");
		};
	});

export const fromPromiseIgnoreErrors = <T>(
	promise: Promise<T>
): Observable<T> =>
	Observable.of(promise).mergeMap(p =>
		Observable.fromPromise(p).catch(e => Observable.empty())
	);
