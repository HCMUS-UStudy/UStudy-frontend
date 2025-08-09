import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";

export default function ReviewSuccessHeader() {
  return (
    <div className="bg-primary p-8 text-center text-white">
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      >
        <FaCheckCircle className="text-4xl text-white" />
      </motion.div>
      <h1 className="text-2xl md:text-3xl font-bold mb-3">
        Đánh giá thành công!
      </h1>
      <p className="text-white/90 max-w-md mx-auto">
        Cảm ơn bạn đã dành thời gian đánh giá khóa học. Ý kiến của bạn rất quý
        giá với chúng tôi.
      </p>
    </div>
  );
}
