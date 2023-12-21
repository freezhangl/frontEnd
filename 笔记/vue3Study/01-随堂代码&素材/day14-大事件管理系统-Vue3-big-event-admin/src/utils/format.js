import { dayjs } from 'element-plus'
3
export const formatTime = (time) => dayjs(time).format('YYYY-MM-DD HH:mm:ss')
