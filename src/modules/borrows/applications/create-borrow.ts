import { UseCase } from '@modules/shared/core/application/use-case';
import { UuidGenerator } from '@modules/shared/core/domain/uuid-generator';
import { UserRepository } from '@modules/shared/users/domain/user-repository';
import { GetBookByIdUseCase } from '@modules/books/application/get-book-by-Id';
import { BookStatus } from '@modules/shared/books/domain/book/book-status';
import { ReservationRepository } from '@modules/shared/reservations/domain/reservation-repository';
import { createReservationId } from '@modules/reservations/domain/reservation/reservation-id';
import { updateStatusToBorrowed } from '@modules/shared/books/domain/book/book';

import { BorrowFailedError } from '../domain/borrow-failed-error';
import { Borrow, createBorrow as create, isValidBorrow } from '../domain/borrow/borrow';
import { BorrowRepository } from '../domain/borrow-repository';
import { CreateBorrowRepository } from '../domain/create-borrow-repository';

export interface CreateBorrowRequest {
  userId: string;
  dueDate: Date;
  bookId: string;
  referenceId: string;
  reservationId: string;
}

export type CreateBorrowUseCase = UseCase<CreateBorrowRequest, Borrow>;

export function createBorrowBuilder({
  uuidGenerantor,
  userRepository,
  reservationRepository,
  borrowRepository,
  createBorrowRepository,
  getBookById,
}: {
  uuidGenerantor: UuidGenerator;
  userRepository: UserRepository;
  reservationRepository: ReservationRepository;
  borrowRepository: BorrowRepository;
  createBorrowRepository: CreateBorrowRepository;
  getBookById: GetBookByIdUseCase;
}): CreateBorrowUseCase {
  return async function createBorrow(req: CreateBorrowRequest) {
    const borrow = create({
      id: uuidGenerantor.generate(),
      userId: req.userId,
      bookId: req.bookId,
      referenceId: req.referenceId,
      dueDate: req.dueDate,
    });

    await userRepository.exists(borrow.userId);

    await reservationRepository.exists(createReservationId(req.reservationId));

    const book = await getBookById({ id: borrow.bookId });

    if (book.status === BookStatus.Borrowed) {
      throw BorrowFailedError.withBookId(book.id);
    }

    const userBorrowRecords = await borrowRepository.find({ userId: borrow.userId });

    const { isValid, reason } = isValidBorrow(userBorrowRecords, book.referenceId);

    if (!isValid) {
      throw new BorrowFailedError(reason || 'failed to borrow book');
    }

    const updatedBook = updateStatusToBorrowed(book);

    await createBorrowRepository.save(updatedBook, borrow);

    return borrow;
  };
}
