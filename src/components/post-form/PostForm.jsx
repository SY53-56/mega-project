import React, { useCallback, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, RTE, Input, Select } from "../index"
import service from "../../appwrite/config"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function PostForm({ post }) {
  const navigate = useNavigate()
  const userData = useSelector((state) => state.user.userData)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    control,
  } = useForm({
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      status: post?.status || "active",
    },
  })

  // ✅ Slug Transform Function
  const slugTransform = useCallback((value) => {
    if (!value || typeof value !== "string") return ""
    return value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-") // multiple spaces → single dash
      .replace(/[^\w-]/g, "") // remove special chars
  }, [])

  // ✅ Auto-update slug when title changes
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name === "title") {
        setValue("slug", slugTransform(value.title), {
          shouldValidate: true,
        })
      }
    })
    return () => subscription.unsubscribe()
  }, [watch, slugTransform, setValue])

  // ✅ Submit Handler
  const submit = async (data) => {
    try {
      let uploadedFileId = null

      // Upload new file if selected
      if (data.image && data.image[0]) {
        const uploaded = await service.uploadFile(data.image[0])
        uploadedFileId = uploaded?.$id || null
      }

      if (post) {
        // ---- UPDATE Post ----
        if (uploadedFileId && post.featuredImage) {
          await service.deleteFile(post.featuredImage) // delete old file
        }

        const updated = await service.updatePost(post.$id, {
          ...data,
          featuredImage: uploadedFileId ?? post.featuredImage,
        })

        if (updated) navigate(`/post/${updated.$id}`)
      } else {
        // ---- CREATE Post ----
        const created = await service.createPost({
          ...data,
          featuredImage: uploadedFileId || undefined,
          userId: userData?.$id,
        })

        if (created) navigate(`/post/${created.$id}`)
      }
    } catch (err) {
      console.error("Error in submit:", err)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="flex flex-wrap">
      {/* LEFT SIDE */}
      <div className="w-2/3 px-2">
        <Input
          label="Title :"
          placeholder="Title"
          className="mb-4"
          {...register("title", { required: true })}
        />

        <Input
          label="Slug :"
          placeholder="Slug"
          className="mb-4"
          {...register("slug", { required: true })}
          onInput={(e) =>
            setValue("slug", slugTransform(e.currentTarget.value), {
              shouldValidate: true,
            })
          }
        />

        <RTE
          label="Content :"
          name="content"
          control={control}
          defaultValue={getValues("content")}
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/3 px-2">
        <Input
          label="Featured Image :"
          type="file"
          className="mb-4"
          accept="image/png, image/jpg, image/jpeg, image/gif"
          {...register("image", { required: !post })}
        />

        {post && (
          <div className="w-full mb-4">
            <img
              src={service.getFilePreview(post.featuredImage)}
              alt={post.title}
              className="rounded-lg"
            />
          </div>
        )}

        <Select
          options={["active", "inactive"]}
          label="Status"
          className="mb-4"
          {...register("status", { required: true })}
        />

        <Button
          type="submit"
          bgColor={post ? "bg-green-500" : undefined}
          className="w-full"
        >
          {post ? "Update" : "Submit"}
        </Button>
      </div>
    </form>
  )
}
