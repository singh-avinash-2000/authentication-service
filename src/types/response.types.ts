export interface ResponseStructure {
	code: number;
	message: string;
	error?: any;
	result?: {} | [];
}
