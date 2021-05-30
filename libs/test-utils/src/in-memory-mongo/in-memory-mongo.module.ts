import { Module } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { InMemoryMongoServer } from './in-memory-mongo.server';

@Module({
  providers: [
    {
      provide: InMemoryMongoServer,
      useFactory: async () => {
        return new InMemoryMongoServer(new MongoMemoryServer());
      }
    }
  ],
  exports: [InMemoryMongoServer]
})
export class InMemoryMongoModule {
  constructor(private readonly server: InMemoryMongoServer) {}

  async onModuleDestroy() {
    await this.server.stop();
  }
}
