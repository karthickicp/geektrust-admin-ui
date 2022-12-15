import { useEffect, useMemo } from "react"
import * as styles from "utils/styles/tailwind";
const Pagination = ({list, limit, page, setCurrentPage}:{list: any[], limit: number, page: number, setCurrentPage: any}) => {
let numOfPages = useMemo(() => Math.floor(list.length/limit), [list, limit]);
console.log(page, 'numof pages');

return(
    <ul className={styles.pagination}>
        <li className={styles.paginationItem} onClick={() =>setCurrentPage(1)}><span>&laquo;</span></li>
        <li className={styles.paginationItem} onClick={() =>setCurrentPage((prev:number) => prev > 1 ? prev -1 : prev)}><span>&#8249;</span></li>
        {[...Array(numOfPages)].map((_, index) => <li key={index} className={page === index + 1 ? `${styles.paginationItem} ${styles.paginationActive}`: styles.paginationItem} onClick={() => setCurrentPage(index+1)}><span>{index + 1}</span></li>)}
        <li className={styles.paginationItem} onClick={() =>setCurrentPage((prev:number) => prev !== numOfPages ? prev +1 : prev)}><span>&#8250;</span></li>
        <li className={styles.paginationItem} onClick={() =>setCurrentPage(numOfPages)}><span>&raquo;</span></li>
    </ul>
)
}
export default Pagination