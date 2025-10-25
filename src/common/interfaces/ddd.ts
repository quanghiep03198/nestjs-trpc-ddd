/**
 * @description Interface for a Use Case Handler in a DDD architecture.
 * It defines a contract for executing business logic with a given input and producing an output.
 *
 * @template Input - The type of the input data required to execute the use case.
 * @template Output - The type of the output data produced by the use case.
 *
 * @author quanghiep03198
 */
export interface IUseCaseHandler<Input, Output> {
	execute(input: Input): Output | Promise<Output>
}
