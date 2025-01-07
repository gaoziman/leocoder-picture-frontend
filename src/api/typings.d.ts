declare namespace API {
  type Category = {
    createTime?: string
    description?: string
    id?: number
    name?: string
    updateTime?: string
  }

  type CategoryRequest = {
    description?: string
    id?: number
    name?: string
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
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
    author?: boolean
    children?: CommentVO[]
    commentCount?: number
    content?: string
    createTime?: string
    id?: number
    likeCount?: number
    liked?: boolean
    parentId?: number
    parentUserName?: string
    pictureId?: number
    userAvatar?: string
    userId?: number
    userName?: string
  }

  type DeleteBatchRequest = {
    ids?: number[]
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

  type getAdjacentPicturesUsingPOSTParams = {
    /** pictureId */
    pictureId: number
    /** sortField */
    sortField: string
    /** sortOrder */
    sortOrder: string
  }

  type getPictureByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getPictureViewCountUsingGETParams = {
    /** id */
    id: number
  }

  type getPictureVOByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getSpaceByIdUsingGETParams = {
    /** id */
    id?: number
  }

  type getSpaceVOByIdUsingGETParams = {
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
    isLiked?: boolean
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

  type MapStringLong_ = true

  type PageCategory_ = {
    current?: number
    pages?: number
    records?: Category[]
    size?: number
    total?: number
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

  type PageSpaceVO_ = {
    current?: number
    pages?: number
    records?: SpaceVO[]
    size?: number
    total?: number
  }

  type PageTag_ = {
    current?: number
    pages?: number
    records?: Tag[]
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
    spaceId?: number
    tags?: string
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    userId?: number
    viewCount?: number
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
    favoriteCount?: number
    id?: number
    introduction?: string
    likeCount?: number
    name?: string
    nullSpaceId?: boolean
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
    spaceId?: number
    tags?: string[]
    userId?: number
    viewCount?: number
  }

  type PictureReviewRequest = {
    id?: number
    reviewMessage?: string
    reviewStatus?: number
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
    spaceId?: number
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
    spaceId?: number
    tags?: string[]
    thumbnailUrl?: string
    updateTime?: string
    url?: string
    user?: UserVO
    userId?: number
    viewCount?: number
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

  type ResultListSpaceLevel_ = {
    code?: number
    data?: SpaceLevel[]
    message?: string
  }

  type ResultListTag_ = {
    code?: number
    data?: Tag[]
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

  type ResultMapStringLong_ = {
    code?: number
    data?: Record<string, any>
    message?: string
  }

  type ResultPageCategory_ = {
    code?: number
    data?: PageCategory_
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

  type ResultPageSpaceVO_ = {
    code?: number
    data?: PageSpaceVO_
    message?: string
  }

  type ResultPageTag_ = {
    code?: number
    data?: PageTag_
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

  type ResultPictureVO_ = {
    code?: number
    data?: PictureVO
    message?: string
  }

  type ResultSpace_ = {
    code?: number
    data?: Space
    message?: string
  }

  type ResultSpaceVO_ = {
    code?: number
    data?: SpaceVO
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

  type Space = {
    createTime?: string
    editTime?: string
    id?: number
    isDelete?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    totalCount?: number
    totalSize?: number
    updateTime?: string
    userId?: number
  }

  type SpaceAddRequest = {
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceLevel = {
    maxCount?: number
    maxSize?: number
    text?: string
    value?: number
  }

  type SpaceQueryRequest = {
    id?: number
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    spaceLevel?: number
    spaceName?: string
    userId?: number
  }

  type SpaceUpdateRequest = {
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
  }

  type SpaceVO = {
    createTime?: string
    editTime?: string
    id?: number
    maxCount?: number
    maxSize?: number
    spaceLevel?: number
    spaceName?: string
    totalCount?: number
    totalSize?: number
    updateTime?: string
    user?: UserVO
    userId?: number
  }

  type Tag = {
    createTime?: string
    description?: string
    id?: number
    name?: string
    updateTime?: string
  }

  type TagRequest = {
    description?: string
    id?: number
    name?: string
    pageNum?: number
    pageSize?: number
    sortField?: string
    sortOrder?: string
    tags?: string[]
  }

  type testDownloadFileUsingGETParams = {
    /** filepath */
    filepath?: string
  }

  type uploadPictureUsingPOSTParams = {
    fileUrl?: string
    id?: number
    picName?: string
    spaceId?: number
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
