/**
 * Authentication
 */
export type DynamoAuthConfigs = {
	/**
	 * Your access key. Do not insert your acesss key
	 * hardcoded, preferable, use a ".env" file to store it.
	 */
	accessKeyId: string;
	/**
	 * Your secret access key. Do not insert your access
	 * key hardcoded, preferable, use a ".env" file to
	 * store it.
	 */
	secretKeyId: string;
	/**
	 * Region where your service is located.
	 */
	region: string;
	/**
	 * Endpoint is useful whenever you are using DynamoDB locally.
	 * Leaving it blank, the connection will be directed to the
	 * Amazon Web Services.
	 */
	endpoint?: string;
};
