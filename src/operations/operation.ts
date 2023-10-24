export class Operation<Input, Output>  {
  input: Input
  output: Output
  constructor(){
  }

  protected async run(data: Input): Promise<Output> {
    return this.output
   }

  execute(data: Input): any { 
     return this.run(data)
  }

}