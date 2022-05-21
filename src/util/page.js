/**
 * @typedef meta Page info
 * @property {integer} offset Pagination Offset
 * @property {integer} limit Pagination Limit
 * @property {integer} total Total of items
 */

/**
 * @typedef links Page links
 * @property {string?} self The link to the actual page
 * @property {string?} next The link to the next page
 * @property {string?} last The link to the last page
 * @property {string?} first The link to the first page
 * @property {string?} prev The link to the previous page
 */

/**
 * @typedef dataItem
 * @property {links} _links Data item relative links
 */

/**
 * @typedef Page
 * @property {meta} _meta General page info
 * @property {dataItem[]} items Page items
 * @property {links} _links Page relative links
 */

/**
 * Generic page
 * @type {Page}
 */
class Page {
  /**
   * @param {object[]} data Page items
   * @param {meta} meta General page info
   * @param {links} links Page relative links
   */
  constructor (
    collectionPath,
    data,
    offset,
    limit,
    total,
    options = {
      pageLinkBuilder: Page.getPageLink,
      selfLinkBuilder: Page.getSelfLink
    }
  ) {
    this.collectionPath = collectionPath
    this.options = options
    this._meta = {
      offset,
      limit,
      total
    }
    this._links = this.getPageLinks()
    this.data = this.getData(data)
  }

  static getPageLink (collectionPath, offset, limit) {
    return `${collectionPath}?offset=${offset}&limit=${limit}`
  }

  static getSelfLink (collectionPath, dataItem, idProperties = ['id']) {
    return `${collectionPath}`.concat(
      idProperties.map((p) => `/${dataItem[p]}`)
    )
  }

  /**
   *
   * @param {string} collectionPath
   * @returns {links}
   */
  getPageLinks () {
    const nextOffset = this._meta.offset + this._meta.limit
    const prevOffset = this._meta.offset - this._meta.limit

    const totalPages =
      this._meta.total % this._meta.limit > 0
        ? Math.floor(this._meta.total / this._meta.limit) + 1
        : Math.floor(this._meta.total / this._meta.limit)
    const lastOffset = (totalPages - 1) * this._meta.limit

    return {
      first: this.options.pageLinkBuilder(
        this.collectionPath,
        0,
        this._meta.limit
      ),
      next:
        this._meta.offset === lastOffset
          ? undefined
          : this.options.pageLinkBuilder(
            this.collectionPath,
            nextOffset,
            this._meta.limit
          ),
      last: this.options.pageLinkBuilder(
        this.collectionPath,
        lastOffset,
        this._meta.limit
      ),
      prev:
        prevOffset < 0
          ? undefined
          : this.options.pageLinkBuilder(
            this.collectionPath,
            prevOffset,
            this._meta.limit
          ),
      self: this.options.pageLinkBuilder(
        this.collectionPath,
        this._meta.offset,
        this._meta.limit
      )
    }
  }

  getData (data) {
    return data.map((d) => {
      return d._doc
        ? {
            ...d._doc,
            _links: {
              self: this.options.selfLinkBuilder(this.collectionPath, d)
            }
          }
        : {
            ...d,
            _links: {
              self: this.options.selfLinkBuilder(this.collectionPath, d)
            }
          }
    })
  }

  /**
   * @returns {Page}
   */
  getJson () {
    return {
      _links: this._links,
      _meta: this._meta,
      data: this.data
    }
  }
}

module.exports = Page
