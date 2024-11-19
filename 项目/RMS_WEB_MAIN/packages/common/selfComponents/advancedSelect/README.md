```
//下拉单选多选
<SpAdvancedSelect
:data.sync="formField.type" //储存的值
:list="options" //list数组
key-id="type" //唯一标识
is-more-type="odd" //是否多选，odd是单选，even是多选
value-txt="type" //value的参数值，默认是value
label-txt="label" //label的参数值，默认是label
placeholder="请选择" //为空时的占位提示文字，默认是请选择
@changeEvent="change" // change事件
></SpAdvancedSelect>
```
