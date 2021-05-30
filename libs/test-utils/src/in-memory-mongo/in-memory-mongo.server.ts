import { Injectable } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';

@Injectable({})
export class InMemoryMongoServer {
  constructor(private readonly server: MongoMemoryServer) {}

  getUri() {
    return this.server.getUri();
  }

  stop() {
    return this.server.stop();
  }
}
