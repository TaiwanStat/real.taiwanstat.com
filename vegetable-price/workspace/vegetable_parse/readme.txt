所有程式請以python3以上版本執行
所有程式皆不需要另外輸入參數

管理新增項目請改動item_manager即可
詳細格式請參照程式碼中的格式

如過要變更新增項目的時間請更動vg_parser內
default_start_date的時間設定
vg_parser會將資料更新至電腦時間的前一日

vg_parser_ver2改正了新增項目的設定
找不到當天資料時會以當天時間之前有資料的那一天價格為標準
但重量設定為零
建議使用vg_parser_ver2