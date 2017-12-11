// @flow
import {Observable} from "rxjs/Observable";
import type {PromiseCancel} from "../api/types";

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
