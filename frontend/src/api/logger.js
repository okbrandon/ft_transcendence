const logger = (message) => {
	if (process.env.NODE_ENV === "development") {
		console.log(message);
	}
};

export default logger;
