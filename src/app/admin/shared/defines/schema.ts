export class Schema {
    item = [
        'name.value', 'name.forSearch',
        'status',
        'thumb',

        'created.user',
        'created.time',
        'modified.user',
        'modified.time',
    ]

    book = [
        'title.value', 'title.forSearch',
        'author.value', 'author.forSearch',
        'description.value', 'description.forSearch',
        'slug',
        'price',
        'thumb',
        'category',

        'status',
        'special',
        'saleOff',

        'created.user',
        'created.time',
        'modified.user',
        'modified.time',
    ]

    category = [
        'name.value', 'name.forSearch',
        'slug',

        'status',
        'created.user',
        'created.time',
        'modified.user',
        'modified.time',
    ]

    user = [
        'username.value', 'username.forSearch',
        'email.value', 'email.forSearch',
        'fullName.value', 'fullName.forSearch',
        'password',
        'status',
        'thumb',
        'group',

        'created.user',
        'created.time',
        'modified.user',
        'modified.time',
    ]

    group = [
        'name.value', 'name.forSearch',
        'acp',

        'status',
        'created.user',
        'created.time',
        'modified.user',
        'modified.time',
    ]

}
