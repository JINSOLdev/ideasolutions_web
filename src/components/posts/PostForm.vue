<template>
    <div>
        <form>
            <div class="mb-3 px-3">
                <label for="title" class="form-label">제목</label>
                <input
                    :value="modelValue.title"
                    @input="$emit('update:modelValue', { ...modelValue, title: $event.target.value })"
                    type="text"
                    class="form-control"
                    id="title"
                />
            </div>
            <div class="mb-3 px-3">
                <label for="contents" class="form-label">내용</label>
                <textarea
                    :value="modelValue.contents"
                    @input="$emit('update:modelValue', { ...modelValue, contents: $event.target.value })"
                    class="form-control"
                    id="contents"
                    rows="3"
                ></textarea>
            </div>
            <div class="d-flex gap-2 mt-4">
                <slot name="actions"></slot>
            </div>
        </form>
    </div>
</template>

<script>
export default {
    props: {
        modelValue: {
            type: Object,
            required: true,
        },
    },
    emits: ['update:modelValue', 'update:contents'], // modelValue의 업데이트를 부모에게 전달하는 이벤트
};
</script>

<style scoped></style>
