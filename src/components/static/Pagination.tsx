import { useMemo } from "react"
import * as styles from "utils/styles/tailwind";
const Pagination = ({list, limit, page, setCurrentPage}:{list: any[], limit: number, page: number, setCurrentPage: any}) => {
let numOfPages = Math.ceil(list.length/limit);
    console.log(page, numOfPages === 0, 'page')
return(
    <ul className={styles.pagination}>
        <li className={page !== 1 ? styles.paginationItem : `${styles.paginationItem} ${styles.paginationDisabled}`}><button className="px-2" disabled={(page === 1 || numOfPages ===0) ? true : false } onClick={() =>setCurrentPage(1)}>&laquo;</button></li>
        <li className={page !== 1 ? styles.paginationItem : `${styles.paginationItem} ${styles.paginationDisabled}`}><button className="px-2" disabled={(page === 1 || numOfPages ===0) ? true : false } onClick={() =>setCurrentPage((prev:number) => prev > 1 ? prev -1 : prev)}>&#8249;</button></li>
        {[...Array(numOfPages)].map((_, index) => <li key={index} className={page === index + 1 ? `${styles.paginationItem} ${styles.paginationActive}`: styles.paginationItem}><button className="px-2" onClick={() => setCurrentPage(index+1)}>{index + 1}</button></li>)}
        <li className={page !== numOfPages ? styles.paginationItem : `${styles.paginationItem} ${styles.paginationDisabled}`}><button className="px-2" disabled={(page === numOfPages || numOfPages ===0) ? true : false} onClick={() =>setCurrentPage((prev:number) => prev !== numOfPages ? prev +1 : prev)}>&#8250;</button></li>
        <li className={page !== numOfPages ? styles.paginationItem : `${styles.paginationItem} ${styles.paginationDisabled}`}><button className="px-2" disabled={(page === numOfPages || numOfPages === 0) ? true : false} onClick={() =>{
            console.log('final click');
            setCurrentPage(numOfPages)
        }}>&raquo;</button></li>
    </ul>
)
}
export default Pagination