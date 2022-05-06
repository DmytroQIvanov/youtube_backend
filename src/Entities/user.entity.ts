import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { VideoEntity } from './video.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => VideoEntity, (video) => video.user, {
    cascade: true,
  })
  videos: VideoEntity[];
}
