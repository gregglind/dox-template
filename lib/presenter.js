module.exports = function presenter (doc) {
  if (doc.ignore || doc.isPrivate) return

  var memberOf = doc.tags.filter(function (doc) {
    return doc.type === 'memberOf'
  })[0]

  var parent = function () {
    if (doc.ctx && doc.ctx.hasOwnProperty('constructor')) {
      return doc.ctx.constructor
    } else if (memberOf && memberOf.parent) {
      return memberOf.parent
    }
  }

  var relatedTag = doc.tags.filter(function (tag) {
    return tag.type
  })[0]

  if (relatedTag) {
    var related = {
      name: relatedTag.local,
      href: relatedTag.local ? relatedTag.local.split('.').pop() : ''
    }
  };

  var moduleTag = doc.tags.filter(function (doc) {
    return doc.type === 'module'
  })[0];

  var name = function(){
    if (moduleTag) {
      if (moduleTag.string) return moduleTag.string
    } else {
      return doc.ctx && doc.ctx.name
    }
  }
  return {
    id: [counter++, Date.now()].join('-'),
    name: name(),
    signiture: doc.ctx && doc.ctx.string,
    type: doc.ctx && doc.ctx.type,
    ctx: doc.ctx,
    description: doc.description,
    full_description: doc.description.full.replace(/<br( \/)?>/g, ' '),
    code: doc.code,
    params: doc.tags.filter(function (tag) { return tag.type === 'param' }),
    has_params: !!doc.tags.filter(function (tag) { return tag.type === 'param' }).length,
    tags: doc.tags,
    module: doc.tags.some(function (tag) { return (tag.type === 'module' || tag.type === 'constructor') }),
    parent: parent(),
    related: related,
    has_related: !!related
  }
}