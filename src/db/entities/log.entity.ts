import { timeStamp } from "console";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
// import { User } from "./user.entity";

@Entity()
export class Log {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    date: Date

    @Column()
    name: string

    @Column()
    message: string

    @Column()
    code: number

    @Column()
    path: string


}