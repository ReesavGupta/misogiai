-- DropForeignKey
ALTER TABLE "ThreadSegment" DROP CONSTRAINT "ThreadSegment_thread_id_fkey";

-- AddForeignKey
ALTER TABLE "ThreadSegment" ADD CONSTRAINT "ThreadSegment_thread_id_fkey" FOREIGN KEY ("thread_id") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
