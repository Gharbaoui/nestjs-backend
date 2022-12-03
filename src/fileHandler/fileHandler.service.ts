import { Injectable } from "@nestjs/common";
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';

@Injectable()
export class FileHandlerService {
    private user_path:string = './uploads/user/';
    private articles_path:string = './uploads/articles';
    fileupload(path:string, data:string):string {
        path = path + uuid();
        fs.writeFileSync(path, data);
        return path;
    }

    uploadUserImage(data:string): string {

        return this.fileupload(this.user_path, data);
    }

    readFile(path:string) {
        return fs.readFileSync(path, 'utf8');
    }
}