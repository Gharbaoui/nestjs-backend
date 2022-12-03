import { Global, Module } from "@nestjs/common";
import { FileHandlerService } from "./fileHandler.service";

@Global()
@Module({
    providers: [FileHandlerService],
    exports: [FileHandlerService]
})
export class FileHandlerModule {}