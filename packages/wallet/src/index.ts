/**
 * The request arguments interface
 */
export interface RequestArguments {
	readonly method: string;
	readonly params?: readonly any[] | object;
}

/// Listener event type
export type EventType = string | symbol;

/// Listener ..
export type Listener = (...args: Array<any>) => void;

/**
 * EIP1193 compatible provider interface
 */
export interface Provider {
	request(args: RequestArguments): Promise<any>;
	on(eventName: EventType, listener: Listener): this;
	removeListener(eventName: EventType, listener: Listener): this;
}

/**
 * The web3connect compatible wallet interface
 */
export interface Wallet {
	/**
	 * Wallet id name
	 */
	readonly name: string;
	/**
	 * Connect wallet and return EIP1193 compatible provider interface
	 */
	connectTo(chainId?: number): Promise<Provider>;

	/**
	 * Disconnect from wallet
	 */
	disconnect(): Promise<void>;

	/**
	 * Check wallet if support connect to special chainId
	 * @param chainId The test chainId
	 */
	connectable(chainId: number): Promise<boolean>;
}
