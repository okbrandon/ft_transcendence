export const logger = (message) => {
	if (process.env.NODE_ENV === "development") {
		console.log(message);
	}
};
