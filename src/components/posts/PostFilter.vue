<template>
    <div>
        <form @submit.prevent>
            <div class="row g-3 mb-3 px-3">
                <div class="col">
                    <input
                        :value="title"
                        @input="$emit('update:title', $event.target.value)"
                        type="text"
                        class="form-control"
                        placeholder="제목으로 검색해주세요."
                    />
                </div>
                <div class="col-3">
                    <select :value="size" @input="$emit('update:size', $event.target.value)" class="form-select">
                        <option value="3">3개씩 보기</option>
                        <option value="6">6개씩 보기</option>
                        <option value="9">9개씩 보기</option>
                    </select>
                </div>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        title: String,
        size: Number, // limit을 size로 변경
    },
    emits: ['update:title', 'update:size'], // update:limit -> update:size
};
</script>
