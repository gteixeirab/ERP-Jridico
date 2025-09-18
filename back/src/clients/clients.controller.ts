import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  UseGuards,
  Req,
} from "@nestjs/common";
import { ClientsService } from "./clients.service";
import { CreateClientDto } from "./dto/create-client.dto";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";

@Controller("clients")
@UseGuards(JwtAuthGuard)
export class ClientsController {
  constructor(private readonly clientsService: ClientsService) {}

  @Post()
  create(@Req() req: any, @Body() createClientDto: CreateClientDto) {
    return this.clientsService.create(createClientDto, req.user.id);
  }

  @Get()
  findAll(@Req() req: any, @Query() query: any) {
    return this.clientsService.findAll(query, req.user.id);
  }

  @Get(":id")
  findOne(@Req() req: any, @Param("id") id: string) {
    return this.clientsService.findOne(id, req.user.id);
  }
}
