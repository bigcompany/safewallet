var ledger = require('../../resources/ledger').ledger;

//
// Note: Validation logic for ledger.update arguments is handled by a schema and the resource engine.
// This custom validation applies specific business logic to validate a ledger update
//
ledger.before('update', function (data, next){
  // make sure that ledger status isn't being updated to same status ( as this will trigger various alerts and business logic )
  // TODO: make sure that ledger entry isnt locked
  ledger.get(data.id, function (err, entry){
    if (entry.status === data.status) {
      return next(new Error('Unable to update with duplicate status'));
    }
    return next(null, data);
  });
});
