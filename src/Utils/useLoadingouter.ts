// router with loading indicator
import { useTransition } from 'react'
import { useRouter } from "next/navigation";
function useLoadingouter() {
  const router = useRouter();
  const push = router.push;
  const [isPending, startTransition] = useTransition();
    router.push = function patched(...args) {
      startTransition(() => {
      push.apply(history, args);
      });
    };
    const back = router.back;
    router.back = function patched(...args) {
      startTransition(() => {
      back();
      });
    };

  return {isPending, router}
}

export default useLoadingouter;
