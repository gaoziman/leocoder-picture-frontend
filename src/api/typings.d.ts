declare namespace API {
  type CancelLikeRequest = {
    id?: number
    pictureId?: number
  }

  type DeleteBatchRequest = {
    ids?: number[]
  }

  type DeleteRequest = {
    id?: number
  }

  type getPictureByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getUserVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type LikeRequest = {
    id?: number
    pictureId?: number
  }

  type LoginUserVO = {
    createTime?: string
    id?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type PagePicture_ = {
    current?: number
    pages?: number
    records?: Picture[]
    size?: number
    total?: number
  }

  type PagePictureVO_ = {
    current?: number
    pages?: number
    records?: PictureVO[]
    size?: number
    total?: number
  }

  type PageUserVO_ = {
    current?: number
    pages?: number
    records?: UserVO[]
    size?: number
    total?: number
  }

  type Picture = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    isDelete?: number
    name?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    tags?: string
    updateTime?: string
    url?: string
    userId?: number
  }

  type PictureEditRequest = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type PictureQueryRequest = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    pageNum?: number
    pageSize?: number
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewerId?: number
    searchText?: string
    sortField?: string
    sortOrder?: string
    tags?: string[]
    userId?: number
  }

  type PictureReviewRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
  }

  type PictureTagCategory = {
    categoryList?: string[]
    tagList?: string[]
  }

  type PictureUpdateRequest = {
    category?: string
    id?: number
    introduction?: string
    name?: string
    tags?: string[]
  }

  type PictureUploadByBatchRequest = {
    count?: number
    namePrefix?: string
    searchText?: string
    source?: string
  }

  type PictureUploadRequest = {
    fileUrl?: string
    id?: number
    picName?: string
  }

  type PictureVO = {
    category?: string
    createTime?: string
    editTime?: string
    id?: number
    introduction?: string
    name?: string
    picFormat?: string
    picHeight?: number
    picScale?: number
    picSize?: number
    picWidth?: number
    reviewMessage?: string
    reviewStatus?: number
    reviewTime?: string
    reviewerId?: number
    tags?: string[]
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
    likeCount?: number
    isLikeCount?: number
  }

  type ResultBoolean_ = {
    code?: number
    data?: boolean
    message?: string
  }

  type ResultInt_ = {
    code?: number
    data?: number
    message?: string
  }

  type ResultLoginUserVO_ = {
    code?: number
    data?: LoginUserVO
    message?: string
  }

  type ResultLong_ = {
    code?: number
    data?: number
    message?: string
  }

  type ResultPagePicture_ = {
    code?: number
    data?: PagePicture_
    message?: string
  }

  type ResultPagePictureVO_ = {
    code?: number
    data?: PagePictureVO_
    message?: string
  }

  type ResultPageUserVO_ = {
    code?: number
    data?: PageUserVO_
    message?: string
  }

  type ResultPicture_ = {
    code?: number
    data?: Picture
    message?: string
  }

  type ResultPictureTagCategory_ = {
    code?: number
    data?: PictureTagCategory
    message?: string
  }

  type ResultPictureVO_ = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type ResultString_ = {
    code?: number
    data?: string
    message?: string
  }

  type ResultUser_ = {
    code?: number
    data?: User
    message?: string
  }

  type ResultUserVO_ = {
    code?: number
    data?: UserVO
    message?: string
  }

  type testDownloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type uploadPictureUsingPOSTParams = {
    fileUrl?: string
    id?: number
    picName?: string
  }

  type User = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    updateTime?: string
    userAccount?: string
    userAvatar?: string
    userName?: string
    userPassword?: string
    userProfile?: string
    userRole?: string
  }

  type UserAddRequest = {
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserInfoRequest = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
  }

  type UserLoginRequest = {
    userAccount?: string
    userPassword?: string
  }

  type UserPasswordRequest = {
    checkPassword?: string
    newPassword?: string
    oldPassword?: string
  }

  type UserQueryRequest = {
    id?: number
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    userAccount?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserRegisterRequest = {
    checkPassword?: string
    userAccount?: string
    userPassword?: string
  }

  type UserUpdateRequest = {
    id?: number
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }

  type UserVO = {
    createTime?: string
    id?: number
    userAccount?: string
    userAvatar?: string
    userName?: string
    userProfile?: string
    userRole?: string
  }
}
