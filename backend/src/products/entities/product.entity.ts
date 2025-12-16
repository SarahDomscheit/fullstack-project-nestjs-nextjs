import { Customer } from 'src/customers/entities/customer.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  price: number;

  @Column({ type: 'uuid', nullable: false })
  ownerId: string;

  // @ManyToOne(() => Customer, (customer) => customer.products)
  // customer: Customer;
}
