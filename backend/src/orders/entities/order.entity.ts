import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true })
  productIds: string[];

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ type: 'uuid' })
  customerId: string;
}
