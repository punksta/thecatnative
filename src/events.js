import Analytics from "appcenter-analytics";

export const trackEvent = (name: string, data: {}) => {
	Analytics.trackEvent(name, data);
};
