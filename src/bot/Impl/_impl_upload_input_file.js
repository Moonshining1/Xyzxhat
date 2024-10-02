export async function _impl_upload_input_file({ file_id }) {
    if (file_id) {
        // const file = await this.getFile({ file_id });
        // console.log('file : ', file);
        const data = {
            type:'photo',
            media : file_id,
        }
        return data;
    }
}
