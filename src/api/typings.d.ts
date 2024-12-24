declare namespace API {
  type CancelLikeRequest = {
    id?: number
    likeType?: number
    pictureId?: number
  }

  type CommentAddRequest = {
    content?: string
    parentId?: number
    pictureId?: number
    userId?: number
  }

  type CommentQueryRequest = {
    id?: string
    pageNum?: number
    pageSize?: number
    pictureId?: string
    sortField?: string
    sortOrder?: string
    userId?: string
  }

  type CommentVO = {
    children?: CommentVO[]
    content?: string
    createTime?: string
    id?: number
    likeCount?: number
    liked?: boolean
    parentId?: number
    pictureId?: number
    userId?: number
  }

  type DeleteBatchRequest = {
    ids?: number[]
  }

  type deleteCommentUsingPOSTParams = {
    /** requestParam */
    requestParam: string
  }

  type DeleteRequest = {
    id?: number
  }

  type FavoritePictureVO = {
    category?: string
    introduction?: string
    isFavorited?: number
    name?: string
    pictureId?: number
    tags?: string[]
    url?: string
  }

  type FavoriteQueryRequest = {
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
  }

  type FavoriteRequest = {
    pictureId?: number
    userId?: number
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

  type IPageCommentVO_ = {
    current?: number
    pages?: number
    records?: CommentVO[]
    size?: number
    total?: number
  }

  type LikeRequest = {
    id?: number
    likeType?: number
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

  type PageFavoritePictureVO_ = {
    current?: number
    pages?: number
    records?: FavoritePictureVO[]
    size?: number
    total?: number
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
    favoriteCount?: number
    id?: number
    introduction?: string
    isDelete?: number
    likeCount?: number
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
    favoriteCount?: number
    id?: number
    introduction?: string
    isFavorited?: number
    isLiked?: number
    likeCount?: number
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

  type ResultIPageCommentVO_ = {
    code?: number
    data?: IPageCommentVO_
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

  type ResultPageFavoritePictureVO_ = {
    code?: number
    data?: PageFavoritePictureVO_
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
