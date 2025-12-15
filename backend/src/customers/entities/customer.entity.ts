// backend/src/customers/customer.entity.ts
import { Product } from 'src/products/entities/product.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class Customer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column('int', { array: true, default: [] })
  orderIds: number[];

  @Column({ nullable: true })
  ownerId: string | null;

  //   @OneToMany(() => Product, (product) => product.customer)
  //   products: Product[];
}
