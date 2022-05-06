import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 's' })
  title: string;

  @Column()
  description: string;

  @Column()
  key: string;

  @Column()
  url: string;

  @ManyToOne(() => UserEntity, (user) => user.videos)
  user: UserEntity;
}
