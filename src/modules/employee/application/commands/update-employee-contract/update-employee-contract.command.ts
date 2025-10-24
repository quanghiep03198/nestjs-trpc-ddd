import { UpdateEmployeeContractDto } from '../../dto/update-employee-contract.dto'

export class UpdateEmployeeContractCommand {
	constructor(public updateEmployeeContractRequest: UpdateEmployeeContractDto) {}
}
