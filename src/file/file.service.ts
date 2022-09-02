import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { CreateFileDto } from './dto/create-file.dto'
import { File, FileDocument } from './schemas/file.schema'

@Injectable()
export class FileService {
  constructor(@InjectModel(File.name) private fileModel: Model<FileDocument>) {}

  async create(createFileDto: CreateFileDto): Promise<string> {
    const createdFile = new this.fileModel({ ...createFileDto })
    await createdFile.save()
    return createFileDto.filename
  }

  find = async (filename: string): Promise<FileDocument | undefined> =>
    await this.fileModel.findOne({ filename })
}
