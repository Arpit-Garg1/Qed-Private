import DataTable from "react-data-table-component"
import { MAX_ITEM_PER_PAGE, MAX_PAGINATION_PER_PAGE } from "../../constants/constants"

const CustomDataTable = ({data, column,perPageItem, ...rest}) => {
    return (
        <DataTable
            column={column}
            data={data}
            striped
            highlightOnHover
            {...rest}
            pagination
            paginationPerPage={perPageItem ? perPageItem : MAX_ITEM_PER_PAGE}
            paginationRowsPerPageOptions={MAX_PAGINATION_PER_PAGE}
        />
    )
}

export default CustomDataTable